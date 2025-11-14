export const generateApiKey = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';
  let key = '';
  for (let i = 0; i < 4; i++) key += letters.charAt(Math.floor(Math.random() * letters.length));
  for (let i = 0; i < 3; i++) key += numbers.charAt(Math.floor(Math.random() * numbers.length));
  for (let i = 0; i < 2; i++) key += symbols.charAt(Math.floor(Math.random() * symbols.length));
  return [...key].sort(() => Math.random() - 0.5).join('');
};
