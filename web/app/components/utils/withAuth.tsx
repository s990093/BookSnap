import { useEffect } from "react";
import { useRouter } from "next/router";

const withAuth = (WrappedComponent: any) => {
    return (props: any) => {
        const router = useRouter();

        useEffect(() => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                router.push("/login");
            }
        }, []);

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;