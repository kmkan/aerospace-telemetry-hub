export async function loginAdmin(username, password) {
    const res = await fetch('http://localhost:4000/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
  
    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();
    localStorage.setItem('jwt', data.token);
}  