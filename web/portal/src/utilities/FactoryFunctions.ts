export function makeRecord<K extends string, V>(keys: readonly K[], init: () => V): Record<K, V>{
    return Object.fromEntries(keys.map(k => [k, init()])) as Record<K, V>
}