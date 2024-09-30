//    void test6() throws IOException {
//        try (Playwright playwright = Playwright.create()) {
//            Browser browser = playwright.chromium().launch();
//            Page page = browser.newPage();
//            page.navigate("https://www.baidu.com/");
//            System.out.println(page.title());
//        }
        Map<String, String> map = new HashMap();
        map.put("PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD", "1");
        map.put("PLAYWRIGHT_BROWSERS_PATH", "C:\\Users\\huoli\\AppData\\Local\\ms-playwright");
        Playwright playwright = Playwright.create(new Playwright.CreateOptions().setEnv(map));
//        Browser browser = playwright.chromium().launch(
//                new BrowserType.LaunchOptions().setHeadless(false)
//                        .setSlowMo(100)
//                        .setDevtools(false));
        Browser browser = playwright.chromium().launch(new BrowserType.LaunchOptions().setHeadless(false));
        BrowserContext browserContext = browser.newContext(new Browser.NewContextOptions().setColorScheme(ColorScheme.DARK).setViewportSize(1000, 500));
        Page page = browserContext.newPage();
        page.navigate("https://www.12306.cn/mormhweb/czyd_2143/");
        int a = 0;
        int b = 0;
        String content = page.content();
        Document document = Jsoup.parse(content);
        Element hySubCol = document.getElementById("hySubCol");
        Node node = hySubCol.parentNode();
        List<Node> nodes = node.childNodes();
        Node childNode = nodes.get(1);
        List<Node> nodes1 = childNode.childNodes();
        for (Node node1 : nodes1) {
            try {
                List<Node> nodes2 = node1.childNodes();
                for (Node node2 : nodes2) {
                    Element product = (Element) node2;
                    String text = product.text();
                    System.out.println("城市：" + text);
                    b++;
                    Attributes attributes = node2.attributes();
                    String href = attributes.get("href");
  