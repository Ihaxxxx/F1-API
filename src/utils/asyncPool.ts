export async function asyncPool(poolLimit: number, array: any, iteratorFn: (arg0: any) => any) {
  const ret = [];
  const executing = new Set();

  for (const item of array) {
    const p = Promise.resolve().then(() => iteratorFn(item));
    ret.push(p);

    executing.add(p);
    const clean = () => executing.delete(p);
    p.then(clean).catch(clean);

    if (executing.size >= poolLimit) {
      await Promise.race(executing);
    }
  }
  return Promise.all(ret);
}
