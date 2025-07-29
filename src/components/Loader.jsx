const Loader = () => {
  const style = `
    .outer_shell {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background: rgba(0, 0, 0, 0.4);

      z-index: 9999;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .loader {
      position: relative;
      width: 40px;
      height: 50px;
      perspective: 70px;
    }

    .loader div {
      width: 100%;
      height: 100%;
      background: rgb(77, 42, 23);
      border: solid rgb(223, 165, 134);
      position: absolute;
      left: 50%;
      transform-origin: left;
      animation: loader 2s infinite;
    }

    .loader div:nth-child(1) { animation-delay: 0.15s; }
    .loader div:nth-child(2) { animation-delay: 0.3s; }
    .loader div:nth-child(3) { animation-delay: 0.45s; }
    .loader div:nth-child(4) { animation-delay: 0.6s; }
    .loader div:nth-child(5) { animation-delay: 0.75s; }

    @keyframes loader {
      0% {
        transform: rotateY(0deg);
      }
      50%, 80% {
        transform: rotateY(-180deg);
      }
      90%, 100% {
        opacity: 0;
        transform: rotateY(-180deg);
      }
    }

    @media (max-width: 600px) {
      .loader {
        width: 30px;
        height: 40px;
      }
    }
  `;

  return (
    <>
      <style>{style}</style>
      <div className="outer_shell">
        <div className="loader">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </>
  );
};

export default Loader;
