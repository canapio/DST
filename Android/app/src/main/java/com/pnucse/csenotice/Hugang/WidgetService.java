package com.pnucse.csenotice.Hugang;

import android.appwidget.AppWidgetManager;
import android.content.Intent;
import android.util.Log;
import android.widget.RemoteViewsService;

/**
 * Created by Dong on 2015-06-19.
 */
public class WidgetService extends RemoteViewsService {
    @Override
    public RemoteViewsFactory onGetViewFactory(Intent intent) {
        Log.d("Hugang_WidgetServic","Remote");
        return(new LoremViewsFactory(this.getApplicationContext(),
                intent));
    }
}

