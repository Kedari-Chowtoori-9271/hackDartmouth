#include <Ethernet.h>

int FSR_1=A0;
int FSR_2=A1;
int Flex_1=A2;
int Flex_2=A3;
int output_1=0;
int output_2=0;
int output_3=0;
int output_4=0;
void setup() {
  Serial.begin(9600);
  // put your setup code here, to run once:

}

void loop() {
output_1=analogRead(FSR_1);
output_2=analogRead(FSR_2);
output_3=analogRead(Flex_1);
output_4=analogRead(Flex_2);
  // put your main code here, to run repeatedly:
Serial.print(output_1);
Serial.print(",");
Serial.print(output_2);
Serial.print(",");
Serial.print(output_3);
Serial.print(",");
Serial.println(output_4);
delay(2000);
}
