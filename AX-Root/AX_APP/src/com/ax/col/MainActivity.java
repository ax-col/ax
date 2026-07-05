package com.ax.col;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.app.Activity;

public class MainActivity extends Activity {

    private WebView myWebView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.layout_main);

        myWebView = (WebView) findViewById(R.id.ax_webview);
        
        // Configuraciones para que tu JavaScript y almacenamiento local funcionen offline
        WebSettings webSettings = myWebView.getSettings();
        webSettings.setJavaScriptEnabled(true); 
        webSettings.setDomStorageEnabled(true);  
        
        // Permisos esenciales para leer archivos HTML de forma interna e híbrida
        webSettings.setAllowFileAccess(true); 
        webSettings.setAllowContentAccess(true);
        webSettings.setAllowFileAccessFromFileURLs(true); 
        webSettings.setAllowUniversalAccessFromFileURLs(true);

        // Hace que todo link que presiones se abra dentro de tu misma App
        myWebView.setWebViewClient(new WebViewClient());

        // Carga tu archivo principal desde la carpeta assets
        myWebView.loadUrl("file:///android_asset/index.html"); 
    }

    // Si presionas el botón de "atrás" en el cel, navega el historial web en vez de cerrarse
    @Override
    public void onBackPressed() {
        if (myWebView.canGoBack()) {
            myWebView.goBack(); 
        } else {
            super.onBackPressed(); 
        }
    }
}
