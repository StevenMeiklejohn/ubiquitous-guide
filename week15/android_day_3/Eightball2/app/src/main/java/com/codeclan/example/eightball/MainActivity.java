package com.codeclan.example.eightball;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
//import android.widget.TextView;

import java.util.Random;

/**
 * Created by sandy on 02/08/2016.
 */
public class MainActivity extends AppCompatActivity {

    EditText mQuestionEditText;
    //TextView mAnswerText;
    Button mShakeButton;

    Answers mAnswers;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        mAnswers = new AnswersFromAPI();

        mQuestionEditText = (EditText)findViewById(R.id.question_text);
        //mAnswerText = (TextView)findViewById(R.id.answer_text);
        mShakeButton = (Button)findViewById(R.id.shake_button);

        mShakeButton.setOnClickListener(new View.OnClickListener() {
              @Override
              public void onClick(View v) {
                  String question = mQuestionEditText.getText().toString();
                  Log.d("EightBall:", "Shake button clicked!");
                  Log.d("EightBall:", "The question asked was '" + question + "'");
//                  String[] answers = {"Yes!", "No!", "Mmm, Maybe"};
//                  Random rand = new Random();
//                  int index = rand.nextInt(answers.length);
//                  String answer = answers[index];
                  String answer = mAnswers.getAnswer();

                  //mAnswerText.setText(answer);
                  Intent intent = new Intent(MainActivity.this, AnswerActivity.class);
                  intent.putExtra("answer", answer);
                  Log.d("EightBall:", "passing '" + answer + "'");
                  startActivity(intent);
              }
        });
     }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater menuInflater = getMenuInflater();
        menuInflater.inflate(R.menu.activity_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == R.id.action_hello) {
            Toast.makeText(MainActivity.this, R.string.menu_toast_hello, Toast.LENGTH_SHORT).show();
        return true;
        }
        if (item.getItemId() == R.id.action_goodbye) {
            Toast.makeText(MainActivity.this, R.string.menu_toast_goodbye, Toast.LENGTH_SHORT).show();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
}
