import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
      <title>Tisa Admin</title> 

    <link rel="stylesheet" href="/assets/plugins/bootstrap/bootstrap.css" />
    <link rel="stylesheet" href="/assets/plugins/fontawesome/css/all.css"/>
     <link rel="stylesheet" href="/assets/plugins/slick-slider/slick.css" />       
    <script src="/assets/js/jquery-3.6.0.js"></script>
    <script src="/assets/js/jquery-ui.js"></script>
    <script src="/assets/plugins/bootstrap/bootstrap.bundle.min.js"></script>
    <script src="/assets/plugins/slick-slider/slick.min.js"></script>
    <script src="/assets/js/Chart.min.js"></script>
    <script src="/assets/js/circle-progress.min.js"></script>
    <script src="/assets/js/script.js"></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
