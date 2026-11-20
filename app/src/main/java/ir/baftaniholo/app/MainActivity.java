package ir.baftaniholo.app;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebSettings;
import android.webkit.WebResourceRequest;
import android.content.Intent;
import android.net.Uri;
import android.view.KeyEvent;

public class MainActivity extends Activity {
    private WebView webView;
    private boolean firstResume = true;
    private static final String STORE_URL = "https://parsaalighelichpour-del.github.io/baftani-holo/";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        // Always fetch the current store site instead of stale cached HTML/CSS/JS.
        settings.setCacheMode(WebSettings.LOAD_NO_CACHE);
        webView.clearCache(true);
        settings.setDatabaseEnabled(true);
        settings.setLoadsImagesAutomatically(true);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        settings.setSupportMultipleWindows(false);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setSafeBrowsingEnabled(true);
        webView.setWebChromeClient(new WebChromeClient());
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                String host = uri.getHost();
                if (host != null && (host.equals("parsaalighelichpour-del.github.io") ||
                    host.endsWith(".supabase.co"))) {
                    return false;
                }
                if ("https".equalsIgnoreCase(uri.getScheme())) {
                    startActivity(new Intent(Intent.ACTION_VIEW, uri));
                    return true;
                }
                return true;
            }
        });
        if (savedInstanceState == null) webView.loadUrl(STORE_URL);
        else webView.restoreState(savedInstanceState);
    }

    @Override
    protected void onResume() {
        super.onResume();
        // The app is a live client of the hosted store. Refresh the current store page
        // whenever the user returns so website deployments and server-side features appear
        // without rebuilding or reinstalling the APK.
        if (firstResume) {
            firstResume = false;
            return;
        }
        if (webView != null) {
            String currentUrl = webView.getUrl();
            if (currentUrl != null && currentUrl.startsWith(STORE_URL)) {
                webView.reload();
            } else {
                webView.loadUrl(STORE_URL);
            }
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        webView.saveState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) webView.goBack();
        else super.onBackPressed();
    }
}
