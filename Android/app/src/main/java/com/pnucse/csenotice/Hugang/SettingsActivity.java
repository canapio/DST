package com.pnucse.csenotice.Hugang;


import android.content.Intent;
import android.media.audiofx.BassBoost;
import android.net.Uri;
import android.os.Bundle;
import android.preference.Preference;
import android.preference.PreferenceActivity;
import android.preference.PreferenceScreen;
import android.widget.Toast;

import com.pnucse.csenotice.Hugang.R;

/**
 * A {@link android.preference.PreferenceActivity} that presents a set of application settings. On
 * handset devices, settings are presented as a single list. On tablets,
 * settings are split by category, with category headers shown to the left of
 * the list of settings.
 * <p/>
 * See <a href="http://developer.android.com/design/patterns/settings.html">
 * Android Design: Settings</a> for design guidelines and the <a
 * href="http://developer.android.com/guide/topics/ui/settings.html">Settings
 * API Guide</a> for more information on developing a Settings UI.
 */
public class SettingsActivity extends PreferenceActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        addPreferencesFromResource(R.xml.pref_settings);

    }

    @Override
    public boolean onPreferenceTreeClick (PreferenceScreen preferenceScreen, Preference preference)
    {
        String key = preference.getKey();
        final String appPackageName = getPackageName();
        // do what ever you want with this key

            if (!key.isEmpty()) {

                //위젯 히스토리 초기화
                /*
                if (key.equals("delete_history")) {
                    Toast.makeText(SettingsActivity.this, "Delete 푸시 히스토리", Toast.LENGTH_SHORT).show();
                    MySQLiteHandler handler = MySQLiteHandler.open(getApplicationContext());
                    handler.removeAll();
                    handler.close();
                }
                */

                if (key.equals("rate")) {
                    //Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=com.pnucse.csenotice.Hugang"));
                    try {
                        startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=" + appPackageName)));
                    }catch(android.content.ActivityNotFoundException anfe){
                        startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse("https://play.google.com/store/apps/details?id=" + appPackageName)));
                    }
                }

                if (key.equals("mailtodeveloper")) {
                    Intent i = new Intent(Intent.ACTION_SEND);
                    i.setType("message/rfc822");
                    i.putExtra(Intent.EXTRA_EMAIL  , new String[]{"canapio.dst@gmail.com"});
                    i.putExtra(Intent.EXTRA_SUBJECT, "subject of email");
                    i.putExtra(Intent.EXTRA_TEXT   , "body of email");
                    try {
                        startActivity(Intent.createChooser(i, "Send mail..."));
                    }catch (android.content.ActivityNotFoundException ex) {
                        Toast.makeText(SettingsActivity.this, "There are no email clients installed.", Toast.LENGTH_SHORT).show();
                    }

                }
            }


        return super.onPreferenceTreeClick(preferenceScreen,preference);
    }
}
