export async function load({ locals }) {
    return {
        user: JSON.stringify(locals.user)
    };
}