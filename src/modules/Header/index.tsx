import './Header.css';

const Header = () => {
	return (
		<header className='header'>
			<h1
				className='header-title'
				role='heading'
				aria-level={1}
			>
				Country Quiz
			</h1>
		</header>
	);
};

export default Header;
