export function add(x: number, y: number) {
  return x + y;
}

describe('Initial test', () => {
  test('add function', () => {
    expect(add(1, 2)).toEqual(3);
  });
});
