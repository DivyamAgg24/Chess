
export const Button = ({onClick, children}:{onClick: () => void, children: React.ReactNode}) => {
    return <div>
        <button className="px-6 text-xl text-white font-bold py-3 rounded bg-green-500 hover:bg-green-600" onClick={onClick}>
            {children}
        </button>
    </div>
}