function NotFound() {
    return `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background: linear-gradient(to bottom right, #bfdbfe, #c4b5fd);">
            <div style="background: #fff; border-radius: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1); padding: 2.5rem; display: flex; flex-direction: column; align-items: center;">
                <svg width="80" height="80" style="color: #a78bfa; margin-bottom: 1.5rem;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 48 48">
                    <circle cx="24" cy="24" r="22" stroke="currentColor" stroke-width="4" fill="none"/>
                    <path d="M16 20h16M16 28h16" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
                </svg>
                <h1 style="font-size: 3rem; font-weight: 800; color: #a78bfa; margin-bottom: 1rem;">404</h1>
                <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.5rem;">Page Not Found</h2>
                <p style="font-size: 1.125rem; color: #6b7280; margin-bottom: 1.5rem; text-align: center;">
                    Sorry, the page you are looking for does not exist or has been moved.
                </p>
                <a href="/" style="padding: 0.5rem 1.5rem; background: #a78bfa; color: #fff; border-radius: 9999px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); text-decoration: none; transition: background 0.2s;">
                    Go Home
                </a>
            </div>
        </div>
    `;
}

export default NotFound;