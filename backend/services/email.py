import os
import yagmail

sender_email_id = os.environ['SENDER_EMAIL_ID']
sender_email_app_password = os.environ['SENDER_EMAIL_APP_PASSWORD']


def send_email_to_user(email: str, content: str) -> None:
    yag = yagmail.SMTP(sender_email_id, sender_email_app_password)
    yag.send(email, subject='OTP', contents=content)
