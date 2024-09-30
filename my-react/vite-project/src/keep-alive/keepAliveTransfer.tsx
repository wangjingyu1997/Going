import { useRef, useContext, useEffect } from "react"
import { KeepAliveContext } from "./KeepAliveContext"
export function keepAliveTransfer(KeepAliveComponent: any, keepAliveId: any) {
    return function (props: any) {
        const _ref = useRef<ReactDOM>(null)
        const { keepAliveStates, setKeepAliveState } = useContext<any>(KeepAliveContext)
        useEffect(() => {
            const state = keepAliveStates[keepAliveId]
            if (state && state.nodes) {
                state.nodes.forEach((node: any) =>
                    _ref.current.appendChild(node)
                )
            } else {
                setKeepAliveState({
                    reactElement: <KeepAliveComponent {...props} />,
                    keepAliveId,
                })
            }
        }, [keepAliveStates, setKeepAliveState, props])
        return (
            <div ref={_ref}>
            </div>
        )
    }
} 