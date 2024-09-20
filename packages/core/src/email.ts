export const email = (authUrl: string, projectName: string) => {
  return `
  <div>
    <div style="background-color: #f7f1f1; color: #040D12; border: 1px solid #040D12; padding: 1rem; border-radius: 5px;">
      <h2 style="color: #183D3D;">Hello, use the following link to log in to, '${projectName}'</h2>
      <a style="font: bold 11px arial; text-decoration: none; background-color: #183D3D; color: #f7f1f1; padding: 10px 10px 10px 10px; border-radius: 5px;" href="${authUrl}">LOGIN</a>
    </div>
  </div>
  `;
};
