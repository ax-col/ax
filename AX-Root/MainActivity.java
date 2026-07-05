package com.ax.proyect;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private WebView myWebView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        myWebView = (WebView) findViewById(R.id.ax_webview);
        
        // Configuración avanzada del WebView
        WebSettings webSettings = myWebView.getSettings();
        webSettings.setJavaScriptEnabled(true); // Permite que tus scripts JS corran sin problemas
        webSettings.setDomStorageEnabled(true);  // Crucial para LocalStorage/SessionStorage de tus apps web
        webSettings.setAllowFileAccess(true);    // Permite acceder a recursos locales si es necesario

        // Evita que los enlaces se abran en el navegador externo del celular
        myWebView.setWebViewClient(new WebViewClient());

        // Opción A: Si vas a cargar tu proyecto web montado en un servidor local o hosting
        myWebView.loadUrl("https://axproyect.ddns.net"); 

        // Opción B: Si prefieres meter los archivos HTML dentro de la carpeta 'assets' de la app:
        // myWebView.loadUrl("file:///android_asset/main_ax.html");
    }

    // Controlar el botón físico/gesto de ir atrás en el celular
    @Override
    public void onBackPressed() {
        if (myWebView.canGoBack()) {
            myWebView.goBack(); // Navega hacia atrás en el historial web
        } else {
            super.onBackPressed(); // Si está en el inicio, sale de la app
        }
    }
}
