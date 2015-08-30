package com.pnucse.csenotice.Hugang;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;
import android.widget.RemoteViews;

import java.util.Date;

/**
 * Created by Dong on 2015-06-19.
 */public class WidgetProvider extends AppWidgetProvider {
    public static String EXTRA_WORD=
            "com.commonsware.android.appwidget.lorem.WORD";

    private static final String TAG = "Hugang Alarm";
    private static final int WIDGET_UPDATE_INTERVAL = 600000;
    private static PendingIntent mSender;
    private static AlarmManager mManager;

    @Override
    public void onReceive(Context context, Intent intent)
    {
        super.onReceive(context, intent);

        String action = intent.getAction();

        // 위젯 업데이트 인텐트를 수신했을 때
        if(action.equals("android.appwidget.action.APPWIDGET_UPDATE"))
        {
            Log.w(TAG, "android.appwidget.action.APPWIDGET_UPDATE");
            removePreviousAlarm();

            long firstTime = System.currentTimeMillis() + WIDGET_UPDATE_INTERVAL;
            mSender = PendingIntent.getBroadcast(context, 0, intent, 0);
            mManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
            mManager.set(AlarmManager.RTC, firstTime, mSender);
        }
        // 위젯 제거 인텐트를 수신했을 때
        else if(action.equals("android.appwidget.action.APPWIDGET_DISABLED"))
        {
            Log.w(TAG, "android.appwidget.action.APPWIDGET_DISABLED");
            removePreviousAlarm();
        }

    }


    public static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId)
    {
        Log.d("Hugang WidgetProvider","updateAppWidget");
        Intent svcIntent=new Intent(context, WidgetService.class);
        svcIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID,  appWidgetId);
        svcIntent.setData(Uri.parse(svcIntent.toUri(Intent.URI_INTENT_SCHEME)));
        RemoteViews widget=new RemoteViews(context.getPackageName(),
                R.layout.list_widget);

        widget.setRemoteAdapter(appWidgetId, R.id.widget_list,
                svcIntent);

        Intent clickIntent=new Intent(context, MainActivity.class);
        clickIntent.putExtra("MODE","HISTORY");
        PendingIntent clickPI= PendingIntent
                .getActivity(context, 0,
                        clickIntent,
                        PendingIntent.FLAG_UPDATE_CURRENT);

        widget.setPendingIntentTemplate(R.id.widget_list, clickPI);
        //this.no
        appWidgetManager.notifyAppWidgetViewDataChanged(appWidgetId,R.id.widget_list);
        appWidgetManager.updateAppWidget(appWidgetId, widget);
        //WidgetService service = new WidgetService();
       // service.onGetViewFactory()
    }

    /**
     * 예약되어있는 알람을 취소합니다.
     */
    public void removePreviousAlarm()
    {
        if(mManager != null && mSender != null)
        {
            mSender.cancel();
            mManager.cancel(mSender);
        }
    }

    @Override
    public void onUpdate(Context ctxt, AppWidgetManager appWidgetManager,
                         int[] appWidgetIds) {
        Log.d("Hugang WidgetProvider","onUpdate");
        for (int i=0; i<appWidgetIds.length; i++) {

            updateAppWidget(ctxt,appWidgetManager,appWidgetIds[i]);

        }

        super.onUpdate(ctxt, appWidgetManager, appWidgetIds);
    }
}