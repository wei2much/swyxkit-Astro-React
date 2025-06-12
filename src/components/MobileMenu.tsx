import { useState, useEffect } from 'react';

export default function MobileMenu() {
	const [isOpen, setIsOpen] = useState(false);
	const [isMenuRendered, setIsMenuRendered] = useState(false);

	useEffect(() => {
		if (isOpen) {
			const timer = setTimeout(() => {
				setIsMenuRendered(true);
			}, 20);
			return () => clearTimeout(timer);
		} else {
			const timer = setTimeout(() => {
				setIsMenuRendered(false);
			}, 300);
			return () => clearTimeout(timer);
		}
	}, [isOpen]);

	const handleLinkClick = () => {
		setTimeout(() => setIsOpen(false), 300);
	};

	const menuItemStyle = (delay: number) => ({
		transitionDelay: `${delay}ms`,
		marginTop: '24px',
		transform: isMenuRendered ? 'translateX(0)' : 'translateX(-16px)',
		opacity: isMenuRendered ? 1 : 0,
		transition:
			'opacity 300ms ease, transform 300ms ease, width 300ms ease, border-color 300ms ease',
		width: isMenuRendered ? '100%' : '0px',
		whiteSpace: 'nowrap' as const
	});

	return (
		<div className="ml-[-0.60rem] md:hidden">
			<button
				className="burger visible"
				aria-label="Toggle menu"
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				style={{
					transition: 'opacity 300ms ease',
					border: 0,
					background: 'transparent',
					width: '40px',
					height: '40px',
					position: 'relative'
				}}
			>
				{!isOpen ? (
					<svg
						className="absolute h-5 w-5 text-gray-900 dark:text-gray-100"
						width="20"
						height="20"
						viewBox="0 0 20 20"
						fill="none"
						style={{
							transform: 'translate(-50%, -50%) scale(1)',
							top: '50%',
							left: '50%',
							opacity: 1,
							transition: 'opacity 300ms ease, transform 300ms ease'
						}}
					>
						<path
							d="M2.5 7.5H17.5"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M2.5 12.5H17.5"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				) : (
					<svg
						className="absolute h-5 w-5 text-gray-900 dark:text-gray-100"
						viewBox="0 0 24 24"
						width="24"
						height="24"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
						fill="none"
						shapeRendering="geometricPrecision"
						style={{
							transform: 'translate(-50%, -50%) scale(1)',
							top: '50%',
							left: '50%',
							opacity: 1,
							transition: 'opacity 300ms ease, transform 300ms ease'
						}}
					>
						<path d="M18 6L6 18" />
						<path d="M6 6l12 12" />
					</svg>
				)}
			</button>

			{isOpen && (
				<ul
					className="menu absolute flex flex-col bg-gray-50 text-2xl uppercase dark:bg-gray-900"
					style={{
						padding: '24px 28px 0 4px',
						margin: 0,
						width: '100%',
						height: '100vh',
						zIndex: 1000,
						opacity: isMenuRendered ? 1 : 0,
						left: 0,
						transition: 'opacity 300ms ease, transform 300ms ease'
					}}
				>
					<li
						className={`border-b border-gray-300 font-semibold text-gray-900 dark:border-gray-700 dark:text-gray-100 ${
							isMenuRendered ? 'border-gray-200 dark:border-gray-600' : ''
						}`}
						style={menuItemStyle(150)}
					>
						<a className="flex w-auto pb-4" onClick={handleLinkClick} href="/">
							Home
						</a>
					</li>
					<li
						className={`border-b border-gray-300 font-semibold text-gray-900 dark:border-gray-700 dark:text-gray-100 ${
							isMenuRendered ? 'border-gray-200 dark:border-gray-600' : ''
						}`}
						style={menuItemStyle(250)}
					>
						<a className="flex w-auto pb-4" onClick={handleLinkClick} href="/blog">
							Blog
						</a>
					</li>
					<li
						className={`border-b border-gray-300 font-semibold text-gray-900 dark:border-gray-700 dark:text-gray-100 ${
							isMenuRendered ? 'border-gray-200 dark:border-gray-600' : ''
						}`}
						style={menuItemStyle(350)}
					>
						<a className="flex w-auto pb-4" onClick={handleLinkClick} href="/about">
							About
						</a>
					</li>
					<li
						className={`border-b border-gray-300 font-semibold text-gray-900 dark:border-gray-700 dark:text-gray-100 ${
							isMenuRendered ? 'border-gray-200 dark:border-gray-600' : ''
						}`}
						style={menuItemStyle(400)}
					>
						<a
							className="flex w-auto pb-4"
							onClick={handleLinkClick}
							href="https://github.com/swyxio/swyxkit"
						>
							GitHub
						</a>
					</li>
				</ul>
			)}
		</div>
	);
}
