// emails/templates.js

// emails/templates.js

export const userWelcomeTemplate = (user) => `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to Schedulr Ease</title>
  </head>
  <body style="margin:0;padding:0;background:linear-gradient(135deg,#00c6ff 0%,#0072ff 100%);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
    <table role="presentation" style="width:100%;padding:40px 10px;">
      <tr>
        <td align="center">
          <table role="presentation" style="width:100%;max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04);">
            <tr>
              <td>
                <!-- Header Section -->
                <div style="background:linear-gradient(135deg,#00c6ff 0%,#0072ff 100%);padding:50px 20px;text-align:center;">
                  <div style="background:#ffffff;width:75px;height:75px;margin:0 auto 20px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);">
                    <span style="font-size:38px;line-height:1;">📅</span>
                  </div>
                  <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;">Welcome to Schedulr Ease</h1>
                  <p style="margin:8px 0 0;color:rgba(255,255,255,0.9);font-size:16px;">We’re thrilled to have you on board!</p>
                </div>

                <!-- Main Body -->
                <div style="padding:40px 30px;">
                  <h2 style="margin:0 0 16px;color:#111827;font-size:22px;font-weight:700;">
                    Hi ${user.fullName} 👋
                  </h2>
                  <p style="margin:0 0 25px;color:#4b5563;font-size:15px;line-height:1.7;">
                    You’ve joined <strong style="color:#0072ff;">Schedulr Ease</strong> — your personal scheduling assistant to simplify booking, manage availability, and stay organized. We’re so glad you’re here!
                  </p>

                  <div style="text-align:center;margin:35px 0;">
                    <a href="#" style="background:linear-gradient(135deg,#00c6ff 0%,#0072ff 100%);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:10px;font-weight:600;display:inline-block;font-size:15px;">
                      Get Started
                    </a>
                  </div>

                  <p style="margin:0;color:#4b5563;font-size:14px;line-height:1.6;">
                    Need help setting up your profile or scheduling your first meeting? Our team is always here to help — just reply to this email and we’ll get you started right away.
                  </p>

                  <p style="margin:35px 0 0;color:#6b7280;font-size:13px;text-align:center;">
                    With ❤️ from the <strong>Schedulr Ease Team</strong>
                  </p>
                </div>

                <!-- Footer -->
                <div style="background:#f9fafb;padding:25px;text-align:center;border-top:1px solid #e5e7eb;">
                  <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.6;">
                    You’re receiving this email because you signed up for <strong>Schedulr Ease</strong>.<br/>
                    © ${new Date().getFullYear()} Schedulr Ease. All rights reserved.
                  </p>
                  <div style="margin-top:10px;">
                    <a href="#" style="color:#0072ff;text-decoration:none;font-size:12px;">Visit Website</a> |
                    <a href="#" style="color:#0072ff;text-decoration:none;font-size:12px;">Unsubscribe</a>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;


export const adminNewUserTemplate = (user) => `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New User Registered - Schedulr Ease</title>
  </head>
  <body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background:linear-gradient(135deg,#00c6ff 0%,#0072ff 100%);padding:40px 20px;">
    <table role="presentation" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04);">
      <tr>
        <td>
          <div style="background:linear-gradient(135deg,#00c6ff 0%,#0072ff 100%);padding:40px 30px;text-align:center;">
            <div style="background:#ffffff;width:60px;height:60px;margin:0 auto 20px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);">
              <span style="font-size:32px;line-height:1;">🎉</span>
            </div>
            <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;">New User Registered!</h1>
            <p style="margin:10px 0 0;color:rgba(255,255,255,0.9);font-size:16px;">A new member has joined <strong>Schedulr Ease</strong></p>
          </div>

          <div style="padding:40px 30px;">
            <p style="margin:0 0 30px;color:#374151;font-size:16px;line-height:1.6;">
              Great news! A new user has successfully signed up on <strong style="color:#0072ff;">Schedulr Ease</strong>. Here are their details:
            </p>

            <table role="presentation" style="width:100%;border-collapse:separate;border-spacing:0;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);border-radius:12px;overflow:hidden;border:1px solid #bae6fd;">
              <tr>
                <td style="padding:24px;">
                  <div style="margin-bottom:20px;">
                    <div style="display:flex;align-items:center;margin-bottom:6px;">
                      <span style="font-size:18px;margin-right:8px;">👤</span>
                      <span style="color:#6b7280;font-size:13px;font-weight:600;">Full Name</span>
                    </div>
                    <div style="color:#111827;font-size:18px;font-weight:600;padding-left:26px;">${user.fullName}</div>
                  </div>

                  <div style="margin-bottom:20px;">
                    <div style="display:flex;align-items:center;margin-bottom:6px;">
                      <span style="font-size:18px;margin-right:8px;">📧</span>
                      <span style="color:#6b7280;font-size:13px;font-weight:600;">Email Address</span>
                    </div>
                    <div style="color:#111827;font-size:16px;font-weight:500;padding-left:26px;">${user.email}</div>
                  </div>

                  <div style="margin-bottom:20px;">
                    <div style="display:flex;align-items:center;margin-bottom:6px;">
                      <span style="font-size:18px;margin-right:8px;">🏷️</span>
                      <span style="color:#6b7280;font-size:13px;font-weight:600;">User Role</span>
                    </div>
                    <div style="padding-left:26px;">
                      <span style="display:inline-block;background:linear-gradient(135deg,#00c6ff 0%,#0072ff 100%);color:#ffffff;padding:6px 14px;border-radius:20px;font-size:14px;font-weight:600;">${user.role}</span>
                    </div>
                  </div>

                  <div>
                    <div style="display:flex;align-items:center;margin-bottom:6px;">
                      <span style="font-size:18px;margin-right:8px;">📅</span>
                      <span style="color:#6b7280;font-size:13px;font-weight:600;">Registration Date</span>
                    </div>
                    <div style="color:#111827;font-size:16px;font-weight:500;padding-left:26px;">
                      ${new Date(user.createdAt).toLocaleString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </td>
              </tr>
            </table>
          </div>

          <div style="background:#f9fafb;padding:30px;text-align:center;border-top:1px solid #e5e7eb;">
            <p style="margin:0 0 10px;color:#9ca3af;font-size:14px;">
              This is an automatic notification from <strong style="color:#0072ff;">Schedulr Ease</strong>.
            </p>
            <p style="margin:0;color:#d1d5db;font-size:13px;">
              © ${new Date().getFullYear()} Schedulr Ease. All rights reserved.
            </p>
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

