package com.timerecorder;

import android.graphics.Color;
import android.view.View;
import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "TimeRecorder";
    }

    @Override
    protected void onResume() {
        super.onResume();
        setTransparent();
    }

    private void setTransparent() {
        //底部导航栏设置为透明
        getWindow().setNavigationBarColor(Color.TRANSPARENT);
        //顶部状态栏设置为透明
        getWindow().setStatusBarColor(Color.TRANSPARENT);
    }
}
