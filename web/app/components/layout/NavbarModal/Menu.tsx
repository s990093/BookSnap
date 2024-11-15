import { XCircleIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/solid";

const menuList = [
    {
        key: "Your profile",
        logo: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z",
        href: "",
    },
    {
        key:"Your posts",
        logo: "M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5"
    },
    {
        key: "Setting",
        logo: "M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5",
        href: ""
    }
];

function MenuList() {
    return (
        <div className="h-3/5 w-4/6 flex flex-col items-center justify-center space-y-4">
            {menuList.map((item) => {
                return (
                    <div key={item.key} className="w-full">
                        <button className="w-full py-2 rounded-md hover:bg-gray-500 flex items-center space-x-2 select-none">
                            {/* can design logo
                            <span> {Logo here} </span>
                            */}
                            <span className="pl-6">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d={item.logo} />
                                </svg>
                            </span>
                            <span><p className="text-center">{item.key}</p></span>
                        </button>
                    </div>
                );
            })}
        </div>
    );
}

export function UserMenu({ change, res, ref }) {
    return (
        <div
            ref={ref}
            className={`h-full lg:w-1/5 sm:w-screen bg-white z-40 rounded-l-2xl fixed transition-transform transform right-0 ${res ? "translate-x-0" : "translate-x-full"
                }`}
        >
            {/* right top corner button*/}
            <div className="h-1/6 w-full bg-gray-300 relative rounded-tl-2xl">
                <div className="h-10 w-10 right-0 absolute flex justify-between">
                    <span>
                        <button>
                            <ArrowsRightLeftIcon className="h-5 w-5"></ArrowsRightLeftIcon>
                        </button>
                    </span>
                    <span>
                        <button onClick={() => change(false)}>
                            <XCircleIcon className="h-5 w-5"></XCircleIcon>
                        </button>
                    </span>
                </div>
                {/* person profile */}
                <div className="h-1/2 w-5/6 px-8 flex items-center space-x-4 pt-3">
                    <span>
                        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        </div>
                    </span>
                    <span>
                        {/* User profile info */}
                        <div className="h-auto w-auto">
                            <h3 className="text-black-100 font-mono font-semibold truncate">
                                Account name
                            </h3>
                            <p className="text-gray-600 antialiased truncate">name</p>
                        </div>
                    </span>
                </div>
            </div>
            <div
                id="target"
                className="relative h-3/6 w-full flex items-center justify-center bg-gray-600"
            >
                <MenuList />
            </div>
        </div>
    );
}
