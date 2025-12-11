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
import AssessmentModal from "@/components/sections/AccountReceivable/AssessmentModal";
import RCMAssessment, {
  RCMAssessmentRef,
} from "@/components/sections/AccountReceivable/RCMAssessment";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRef, useState } from "react";

export default function HomePage() {
  const arRef = useRef<AccountReceivableRef>(null);
  const assessmentRef = useRef<RCMAssessmentRef>(null);
  const [excelModalVisible, setExcelModalVisible] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [showAssessment, setShowAssessment] = useState(false);
  const [initialTabKey, setInitialTabKey] = useState<string | undefined>();
  const [initialSubTabKey, setInitialSubTabKey] = useState<
    string | undefined
  >();
  const [initialAssessmentTabKey, setInitialAssessmentTabKey] = useState<
    string | undefined
  >();
  const [showAdequacy, setShowAdequacy] = useState(false);
  const [showEffectiveness, setShowEffectiveness] = useState(false);
  const [showEfficiency, setShowEfficiency] = useState(false);

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
    setShowAssessment(false);
  };

  const handleNavigateToAssessment = (tabKey: string) => {
    setInitialAssessmentTabKey(tabKey);
    setShowLanding(false);
    setShowAssessment(true);
  };

  const handleBackToLanding = () => {
    setShowLanding(true);
    setShowAssessment(false);
  };

  return (
    <ProtectedRoute>
      <main className="relative">
        <Navbar onExcelUploadClick={() => setExcelModalVisible(true)} />
        {showLanding ? (
          <RCMLanding
            onNavigate={handleNavigateFromLanding}
            onNavigateToAssessment={handleNavigateToAssessment}
            onOpenAdequacy={() => setShowAdequacy(true)}
            onOpenEffectiveness={() => setShowEffectiveness(true)}
            onOpenEfficiency={() => setShowEfficiency(true)}
          />
        ) : showAssessment ? (
          <RCMAssessment
            ref={assessmentRef}
            initialTabKey={initialAssessmentTabKey}
            onBackToLanding={handleBackToLanding}
          />
        ) : (
          <AccountReceivable
            ref={arRef}
            initialTabKey={initialTabKey}
            initialSubTabKey={initialSubTabKey}
            onBackToLanding={handleBackToLanding}
          />
        )}

        <ExcelUploadModal
          visible={excelModalVisible}
          onClose={() => setExcelModalVisible(false)}
          onDataLoaded={handleDataLoaded}
        />

        {/* <AssessmentModal
          type="adequacy"
          visible={showAdequacy}
          onClose={() => setShowAdequacy(false)}
        />
        <AssessmentModal
          type="effectiveness"
          visible={showEffectiveness}
          onClose={() => setShowEffectiveness(false)}
        />
        <AssessmentModal
          type="efficiency"
          visible={showEfficiency}
          onClose={() => setShowEfficiency(false)}
        /> */}
      </main>
    </ProtectedRoute>
  );
}
