// "use client";

// import Navbar from "@/components/layout/Navbar";
// import AccountReceivable, {
//   AccountReceivableRef,
// } from "@/components/sections/AccountReceivable/index";
// import { useRef } from "react";

// export default function HomePage() {
//   const arRef = useRef<AccountReceivableRef>(null);

//   const handleImport = (file: File) => {
//     arRef.current?.triggerImport(file);
//   };

//   return (
//     <main className="relative">
//       <Navbar onImport={handleImport} />
//       <AccountReceivable ref={arRef} />
//     </main>
//   );
// }

// src\app\page.tsx

"use client";

import Navbar from "@/components/layout/Navbar";
import AccountReceivable, {
  AccountReceivableRef,
} from "@/components/sections/AccountReceivable/index";
import ExcelUploadModal from "@/components/sections/AccountReceivable/ExcelUploadModal";
import RCMLanding from "@/components/sections/AccountReceivable/RCMLanding";
import { useRef, useState } from "react";

export default function HomePage() {
  const arRef = useRef<AccountReceivableRef>(null);
  const [excelModalVisible, setExcelModalVisible] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [initialTabKey, setInitialTabKey] = useState<string | undefined>();
  const [initialSubTabKey, setInitialSubTabKey] = useState<
    string | undefined
  >();

  const handleImport = (file: File) => {
    arRef.current?.triggerImport(file);
  };

  const handleDataLoaded = (data: any[]) => {
    // This will be handled by the modal directly through the AccountReceivable component
    setExcelModalVisible(false);
  };

  const handleNavigateFromLanding = (tabKey: string, subTabKey?: string) => {
    setInitialTabKey(tabKey);
    setInitialSubTabKey(subTabKey);
    setShowLanding(false);
  };

  return (
    <main className="relative">
      <Navbar onExcelUploadClick={() => setExcelModalVisible(true)} />
      {showLanding ? (
        <RCMLanding onNavigate={handleNavigateFromLanding} />
      ) : (
        <AccountReceivable
          ref={arRef}
          initialTabKey={initialTabKey}
          initialSubTabKey={initialSubTabKey}
          onBackToLanding={() => setShowLanding(true)}
        />
      )}

      <ExcelUploadModal
        visible={excelModalVisible}
        onClose={() => setExcelModalVisible(false)}
        onDataLoaded={handleDataLoaded}
      />
    </main>
  );
}
