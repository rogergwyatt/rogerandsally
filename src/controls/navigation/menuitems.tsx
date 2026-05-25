export interface MenuItem {
    title: string;
    route?: string;
    children?: MenuItem[];
  }
  
export const menuItems: MenuItem[] = [
    {
      title: "deals",
      children: [
        {
          title: "Kitchen Shine Up",
          route: "/kitchenshineupdeal",
        },
        {
          title: "Holiday Special",
          route: "/holidayspecial",
        }
      ],
    },
  ];
  