package com.pnucse.csenotice.Hugang;

import android.appwidget.AppWidgetManager;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.LinearLayout;
import android.widget.RemoteViews;
import android.widget.RemoteViewsService;
import android.widget.TextView;
import android.widget.Toast;


import java.util.ArrayList;
import java.util.List;

/**
 * Created by Dong on 2015-06-19.
 */

public class LoremViewsFactory implements RemoteViewsService.RemoteViewsFactory {
    private static final String[] items = {"lorem", "ipsum", "dolor",
            "sit", "amet", "consectetuer",
            "adipiscing", "elit", "morbi",
            "vel", "ligula", "vitae",
            "arcu", "aliquet", "mollis",
            "etiam", "vel", "erat",
            "placerat", "ante",
            "porttitor", "sodales",
            "pellentesque", "augue",
            "purus"};

    private Context ctxt = null;
    private int appWidgetId;
    String regId;



    private List<String> mItems =new ArrayList<String>();



    public LoremViewsFactory(Context ctxt, Intent intent) {
        this.ctxt = ctxt;
        appWidgetId = intent.getIntExtra(AppWidgetManager.EXTRA_APPWIDGET_ID,
                AppWidgetManager.INVALID_APPWIDGET_ID);
    }

    @Override
    public void onCreate() {
        Log.d("Hugang_widget","onCreate()");


    }



    @Override
    public void onDestroy() {
        // no-op
    }

    @Override
    public int getCount() {
        return (mItems.size());
    }

    @Override
    public RemoteViews getViewAt(int position) {
        RemoteViews row = new RemoteViews(ctxt.getPackageName(),
                R.layout.row);
        Log.d("Hugang_remoteview","getViewAt" + position);
        row.setTextViewText(R.id.widget_item, mItems.get(position));

        Intent i = new Intent();
        Bundle extras = new Bundle();

        extras.putString(WidgetProvider.EXTRA_WORD, mItems.get(position));
        i.putExtras(extras);
        row.setOnClickFillInIntent(R.id.widget_item, i);

        return (row);
    }

    @Override
    public RemoteViews getLoadingView() {
        return (null);
    }

    @Override
    public int getViewTypeCount() {
        return (1);
    }

    @Override
    public long getItemId(int position) {
        return (position);
    }

    @Override
    public boolean hasStableIds() {
        return (true);
    }

    @Override
    public void onDataSetChanged() {
        // no-op
        mItems.clear();
        Log.d("Hugang ViewsFactory","onDataSetChanged");
        MySQLiteHandler handler = MySQLiteHandler.open(ctxt);
        Cursor c = handler.select();

        while(c.moveToNext()) {
            int _id = c.getInt(c.getColumnIndex("_id"));
            String name = c.getString(c.getColumnIndex("name"));
            mItems.add(0,name);
            Log.i("Hugang_xxx", name);  //Log.i(태그, 출력텍스트) --> ddms 의 log 창에서 확인가능
        }//end while
        c.close();
        handler.close();
    }
}



