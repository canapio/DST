package com.pnucse.csenotice.Hugang;

import android.content.Context;
import android.graphics.drawable.Drawable;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.pnucse.csenotice.Hugang.R;

/**
 * 아이템으로 보여줄 뷰 정의
 *
 * @author Mike
 *
 */
public class IconTextView extends LinearLayout {

    /**
     * Icon
     */
    private ImageView mIcon;

    /**
     * TextView 01
     */
    private TextView mText01;

    /**
     * TextView 02
     */
    private TextView mText02;

    /**
     * Header
     */
    private TextView footer;


    private ImageView mIcon2;


    public IconTextView(Context context, IconTextItem aItem) {
        super(context);

        // Layout Inflation
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        inflater.inflate(R.layout.listitem_prof, this, true);


        // Set Icon
        mIcon = (ImageView) findViewById(R.id.iconItem);
        mIcon.setImageDrawable(aItem.getIcon());

        // Set Text 01
        mText01 = (TextView) findViewById(R.id.prof_name);
        mText01.setText(aItem.getData(0));

        // Set Text 02
        mText02 = (TextView) findViewById(R.id.tab_num);
        mText02.setText(aItem.getData(1));

        // Set header
        footer = (TextView)findViewById(R.id.prof_head);
        footer.setVisibility(View.GONE);


        mIcon2 = (ImageView) findViewById(R.id.prof_light);
        mIcon2.setImageDrawable(aItem.getIcon2());

    }

    /**
     * set Text
     *
     * @param index
     * @param data
     */
    public void setText(int index, String data) {
        if (index == 0) {
            mText01.setText(data);
        } else if (index == 1) {
            mText02.setText(data);
        } else {
            throw new IllegalArgumentException();
        }
    }

    /**
     * set Icon
     *
     * @param icon
     */
    public void setIcon(Drawable icon) {
        mIcon.setImageDrawable(icon);
    }

    public void setIcon2(Drawable icon){
        mIcon2.setImageDrawable(icon);
    }

}
