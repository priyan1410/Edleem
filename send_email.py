from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def send_enquiry_email(student_email, student_name, course_name, phone, department, year, college, state):
    """
    Send a confirmation email to the student who filled the enquiry form.

    Args:
        student_email (str): The student's email address
        student_name (str): The student's name
        course_name (str): The selected course name
        phone (str): Student's phone number
        department (str): Student's department
        year (str): Student's year
        college (str): Student's college
        state (str): Student's state
    """
    # Email configuration
    sender_email = "ready@edleem.com"
    sender_password = "Humeen@edleem2025"
    smtp_server = "smtp.hostinger.com"
    smtp_port = 465

    # Create message
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = student_email
    msg['Subject'] = "Thank you for your enquiry - Edleem"

    # Email body
    body = f"""
Dear {student_name},

Thank you for your interest in our {course_name} course at Edleem!

We have received your enquiry with the following details:
- Name: {student_name}
- Email: {student_email}
- Phone: {phone}
- Course: {course_name}
- Department: {department}
- Year: {year}
- College: {college if college else 'Not provided'}
- State: {state}

Our team will get back to you within 24 hours with more information about the course, curriculum, and enrollment process.

In the meantime, feel free to explore our website for more details about our programs.

Best regards,
Edleem Team
Email: ready@edleem.com
Phone: +91 98765 xxxxx
Website: www.edleem.com
"""

    msg.attach(MIMEText(body, 'plain'))

    try:
        # Create SMTP session
        server = smtplib.SMTP_SSL(smtp_server, smtp_port)
        server.login(sender_email, sender_password)

        # Send email
        text = msg.as_string()
        server.sendmail(sender_email, student_email, text)
        server.quit()

        print(f"Email sent successfully to {student_email}")
        return True

    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        return False

@app.route('/send_email', methods=['POST'])
def handle_enquiry():
    try:
        # Get form data
        data = request.form
        name = data.get('name')
        email = data.get('email')
        phone = data.get('phone')
        course = data.get('course')
        department = data.get('department')
        year = data.get('year')
        college = data.get('college', '')
        state = data.get('state')

        # Validate required fields
        if not all([name, email, phone, course, department, year, state]):
            return jsonify({'success': False, 'message': 'Missing required fields'}), 400

        # Send email
        success = send_enquiry_email(email, name, course, phone, department, year, college, state)

        if success:
            return jsonify({'success': True, 'message': 'Email sent successfully'})
        else:
            return jsonify({'success': False, 'message': 'Failed to send email'}), 500

    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
