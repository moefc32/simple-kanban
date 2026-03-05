import trimText from './trimText';

export default function isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimText(email));
}
