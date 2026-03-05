import { browser } from '$app/environment';
import { Notyf } from 'notyf';

let instance;

export default new Proxy({}, {
    get(_, prop) {
        if (!browser) return () => { };

        if (!instance) {
            instance = new Notyf({
                duration: 3000,
            });
        }

        return instance[prop];
    }
});
