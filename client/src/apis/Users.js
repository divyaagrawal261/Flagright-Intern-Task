
export const addUser = async ({firstName, lastName, email, phone, address, payment_methods}) =>{
    const id = crypto.randomUUID();
    const response = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id,
            name: firstName + " " + lastName,
            email,
            phone,
            address,
            payment_methods
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to add user');
    }

    return response.json();
}