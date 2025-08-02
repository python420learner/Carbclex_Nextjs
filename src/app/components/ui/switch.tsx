"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

export function Switch(props) {
  return (
    <SwitchPrimitive.Root
      className="bg-gray-300 data-[state=checked]:bg-blue-500 w-10 h-6 rounded-full relative transition-colors"
      {...props}
    >
      <SwitchPrimitive.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform translate-x-1 data-[state=checked]:translate-x-5" />
    </SwitchPrimitive.Root>
  );
}



// import * as SwitchPrimitive from "@radix-ui/react-switch";

// import { cn } from "./utils";

// function Switch({
//   className,
//   ...props
// }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
//   return (
//     <SwitchPrimitive.Root
//       data-slot="switch"
//       className={cn(
//         "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-switch-background focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
//         className,
//       )}
//       {...props}
//     >
//       <SwitchPrimitive.Thumb
//         data-slot="switch-thumb"
//         className={cn(
//           "bg-card dark:data-[state=unchecked]:bg-card-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
//         )}
//       />
//     </SwitchPrimitive.Root>
//   );
// }

// export { Switch };
