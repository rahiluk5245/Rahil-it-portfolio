export class ScrollSmoother {
  static create(_vars?: any) {
    return new ScrollSmoother();
  }

  static refresh(_vars?: any) {
    return ScrollSmoother;
  }

  scrollTop(val?: number) {
    if (val !== undefined) {
      window.scrollTo({ top: val, behavior: "auto" });
      return val;
    }
    return window.scrollY;
  }

  paused(state?: boolean) {
    if (state !== undefined) {
      if (state) {
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
      } else {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
      }
      return state;
    }
    return document.body.style.overflow === "hidden";
  }

  scrollTo(target: any, smooth?: boolean, _position?: string) {
    if (typeof target === "string") {
      const el = document.querySelector(target);
      if (el) {
        el.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
      }
    } else if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
    }
  }

  refresh() {
    // noop
  }
}
