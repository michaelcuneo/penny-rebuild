import type { ContactMailer } from "../../ambient";

export const email = (data: ContactMailer) => {
  return `
  <div>
    <h2 style="color: #183D3D;">Hello FASTlab, someone using penny.soci.org.au has sent you an email.</h2>
    <div style="background-color: #f7f1f1; color: #040D12; border: 1px solid #040D12; padding: 1rem; border-radius: 5px;">
      <h2>First Name: ${data.firstname}</h2>
      <h2>Last Name: ${data.lastname}</h2>
      <h2>Email: ${data.email}</h2>
      <h2>Message: ${data.message}</h2>
      <h3 style="font-style: italic; color: #183D3D;">DO NOT REPLY TO THIS MESSAGE - CLICK THE BUTTON BELOW TO REPLY.</h3>
      <a style="font: bold 11px arial; text-decoration: none; background-color: #183D3D; color: #f7f1f1; padding: 10px 10px 10px 10px; border-radius: 5px;" href="mailto:${data.email}">Reply to ${data.firstname}</a>
    </div>
  </div>
  `;
};
