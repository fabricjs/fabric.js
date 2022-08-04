
export let uid = 0;

export function increment() {
    uid++;
}

export function set(value: number) {
    uid = value;
}

export function reset() {
    uid = 0;
}