export function AcController(): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata("controller", target, target.prototype);
  };
}
