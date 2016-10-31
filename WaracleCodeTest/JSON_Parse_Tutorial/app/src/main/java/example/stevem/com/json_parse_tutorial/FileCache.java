package example.stevem.com.json_parse_tutorial;

import java.io.File;
import android.content.Context;

public class FileCache {

    private File cacheDir;

    public FileCache(Context context) {
        // Find the dir to save cached images
        if (android.os.Environment.getExternalStorageState().equals(
                android.os.Environment.MEDIA_MOUNTED))
            cacheDir = new File(
                    android.os.Environment.getExternalStorageDirectory(),
                    "JsonParseTutorialCache");
        else
            cacheDir = context.getCacheDir();
        if (!cacheDir.exists())
            cacheDir.mkdirs();
    }
}

