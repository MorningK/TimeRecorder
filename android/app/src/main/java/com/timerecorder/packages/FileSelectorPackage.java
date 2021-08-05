package com.timerecorder.packages;

import android.Manifest;
import android.app.Activity;
import android.content.ContentResolver;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.ParcelFileDescriptor;
import android.provider.DocumentsContract;
import android.provider.MediaStore;
import android.util.Log;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.*;
import com.facebook.react.uimanager.ViewManager;

import java.io.File;
import java.io.FileDescriptor;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

public class FileSelectorPackage implements ReactPackage {
  private static final String TAG = "FileSelector";

  @NonNull
  @Override
  public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {
    List<NativeModule> list = new ArrayList<>();
    list.add(new FileSelectorModule(reactContext));
    return list;
  }

  @NonNull
  @Override
  public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
    return Collections.emptyList();
  }

  private static class FileSelectorModule extends ReactContextBaseJavaModule {
    private static Callback onDone;
    private static Callback onCancel;
    private static final int READ_CODE = 1;
    private static final int WRITE_CODE = 2;

    @NonNull
    @Override
    public String getName() {
      return "FileSelector";
    }

    public FileSelectorModule(@Nullable ReactApplicationContext reactContext) {
      super(reactContext);
      getReactApplicationContext().addActivityEventListener(new ActivityEventListener());
    }

    @ReactMethod
    public void show(final ReadableMap props, final Callback onDone, final Callback onCancel) {
      FileSelectorModule.onDone = onDone;
      FileSelectorModule.onCancel = onCancel;
      openFileSelector(props);
    }

    private void openFileSelector(ReadableMap props) {
      Intent intent = null;
      String method = props.hasKey("method") ? props.getString("method") : "read";
      int requestCode = 0;
      if ("write".equals(method)) {
        intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        requestCode = WRITE_CODE;
      } else {
        intent = new Intent(Intent.ACTION_GET_CONTENT);
        requestCode = READ_CODE;
      }
      String type = props.hasKey("type") ? props.getString("type") : null;
      if (type == null) {
        intent.setType("*/*");
      } else {
        intent.setType(type);
      }
      boolean multi = props.hasKey("multi") && props.getBoolean("multi");
      if (multi) {
        intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
      }
      String dir = props.getString("dir");
      if (dir != null) {
        Uri uri = Uri.fromFile(new File(dir));
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
          intent.putExtra(DocumentsContract.EXTRA_INITIAL_URI, uri);
        }
      }
      String filename = props.getString("filename");
      if (filename != null) {
        intent.putExtra(Intent.EXTRA_TITLE, filename);
      }
      intent.addCategory(Intent.CATEGORY_OPENABLE);
      Objects.requireNonNull(this.getCurrentActivity()).startActivityForResult(intent, requestCode);
    }

    private static class ActivityEventListener implements com.facebook.react.bridge.ActivityEventListener {

      @Override
      public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (requestCode != WRITE_CODE && requestCode != READ_CODE) {
          Log.d(TAG, "onActivityResult: requestCode none match");
          return;
        }
        if (resultCode == AppCompatActivity.RESULT_OK) {
          Log.d("FileSelector", "onActivityResult: " +
                  "requestCode is " + requestCode +
                  " data is " + data.getData() +
                  "data string is " + data.getDataString());
          String filePath = data.getDataString();
          if (onDone != null) {
            onDone.invoke(filePath);
          }
          onDone = null;
        } else if (resultCode == AppCompatActivity.RESULT_CANCELED) {
          if (onCancel != null) {
            onCancel.invoke();
          }
          onCancel = null;
        }
      }

      @Override
      public void onNewIntent(Intent intent) {

      }
    }
  }


}
