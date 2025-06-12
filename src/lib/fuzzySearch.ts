import uFuzzy from '@leeoniya/ufuzzy';

interface SearchablePost {
	slug: string;
	title: string;
	description: string;
	category: string;
	tags: string[];
	content?: string;
	subtitle?: string;
}

// Export search configuration
export let isSearchExact = false;

export function setIsSearchExact(value = !isSearchExact) {
	isSearchExact = value;
}

let u = new uFuzzy({ intraMode: 1 });

export function changeSearchMode() {
	isSearchExact = !isSearchExact;
	if (isSearchExact) {
		u = new uFuzzy({ intraMode: 0, interLft: 1, interRgt: 1 });
	} else {
		u = new uFuzzy({ intraMode: 1, interLft: 0, interRgt: 0 });
	}
}

// Debounce function for search performance
function debounce<T extends (...args: any[]) => any>(func: T, wait: number) {
	let timeout: NodeJS.Timeout;
	return (...args: Parameters<T>): Promise<ReturnType<T>> => {
		return new Promise((resolve) => {
			const later = () => {
				timeout = null!;
				resolve(func.apply(null, args));
			};
			const callNow = !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) resolve(func.apply(null, args));
		});
	};
}

function _fuzzySearch(
	items: SearchablePost[],
	selectedCategories: string[],
	search: string
): (SearchablePost & { highlightedResults?: string })[] {
	// Filter by categories first
	const filteredItems = items.filter((item) => {
		if (selectedCategories?.length < 1) return true;
		return selectedCategories
			.map((element) => element.toLowerCase())
			.includes(item.category.toLowerCase());
	});

	if (search) {
		// Create searchable text from each post
		const haystack = filteredItems.map((v) =>
			[
				v.title,
				v.subtitle || '',
				v.tags.map((tag) => 'hashtag-' + tag).join(' '), // add #tag for tag search
				v.content || '',
				v.description
			].join(' ')
		);

		const idxs = u.filter(haystack, search);
		if (!idxs || idxs.length === 0) {
			return [];
		}

		const info = u.info(idxs, haystack, search);
		const order = u.sort(info, haystack, search);

		const mark = (part: string, matched: boolean) =>
			matched ? `<b style="color:var(--brand-accent)">${part}</b>` : part;

		const list = order.map((i) => {
			const x = filteredItems[info.idx[order[i]]];
			const hl = uFuzzy
				.highlight(
					haystack[info.idx[order[i]]]
						// Sanitize HTML
						.replaceAll('<', ' ')
						.replaceAll('/>', '  ')
						.replaceAll('>', ' '),
					info.ranges[order[i]],
					mark
				)
				// Extract context around match
				.slice(
					Math.max(info.ranges[order[i]][0] - 200, 0),
					Math.min(info.ranges[order[i]][1] + 200, haystack[info.idx[order[i]]].length)
				)
				// Clean up word boundaries
				.split(' ')
				.slice(1, -1)
				.join(' ');

			return { ...x, highlightedResults: hl };
		});

		return list;
	} else {
		return filteredItems;
	}
}

export function fuzzySearch(items: SearchablePost[], selectedCategories: string[], search: string) {
	return debounce(_fuzzySearch, 100)(items, selectedCategories, search);
}
