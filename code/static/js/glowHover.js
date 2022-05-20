const mouseGlow = (element, background) => {
    let lightColor = "fff",
      gradientSize = 5;
    const el = document.querySelector(element);
    el.addEventListener("mousemove", e => {
      let x = e.pageX - e.target.offsetLeft,
        y = e.pageY - e.target.offsetTop,
        xy = x + " " + y,
        bgWebKit =
          "-webkit-gradient(radial, " +
          xy +
          ", 0, " +
          xy +
          ", 100, from(rgba(255,255,255,0.8)), to(rgba(255,255,255,0.0))), " +
          background,
        bgMoz =
          "-moz-radial-gradient(" +
          x +
          "px " +
          y +
          "px 45deg, circle, " +
          lightColor +
          " 0%, " +
          background +
          " " +
          gradientSize +
          "px)";
  
      el.style.background = bgWebKit;
      el.style.background = bgMoz;
    });
    el.addEventListener("mouseleave", e => {
      e.target.style.background = background;
    });
  };
  mouseGlow("glowDiv", "#E09F3E");
  