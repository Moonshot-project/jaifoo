import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Header from "@/components/Header";

interface AuthenticationDialogProps {
    onGoToPersonalization: () => void;
    onStayOnQuiz: () => void;
}

export default function AuthenticationDialog({
    onGoToPersonalization,
    onStayOnQuiz,
}: AuthenticationDialogProps) {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="flex items-center justify-center px-6 py-8 min-h-[calc(100vh-120px)]">
                <AlertDialog open={true}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Authentication Required
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                You need to complete the personalization process
                                before taking the quiz. This helps us provide
                                you with personalized questions and results.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={onStayOnQuiz}>
                                Stay Here
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={onGoToPersonalization}
                                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900"
                            >
                                Go to Personalization
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </main>
        </div>
    );
}
