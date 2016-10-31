package com.codeclan.example.eightball;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.widget.TextView;

/**
 * Created by sandy on 02/08/2016.
 */
public class AnswerActivity extends AppCompatActivity {

    TextView mAnswerText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        Log.d("EightBall:", "AnswerActivity.onCreate called");
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_answer);

        mAnswerText = (TextView)findViewById(R.id.answer_text);

        Intent intent = getIntent();
        Bundle extras = intent.getExtras();
        String answer = extras.getString("answer");
        mAnswerText.setText(answer);

    }
}
