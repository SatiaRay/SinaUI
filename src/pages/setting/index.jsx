import { Export } from "./export"
import { Import } from "./import"

function Setting () {
    return(
        <section className="flex px-4 gap-10 flex-col h-screen overflow-hidden items-center justify-center text-black">
        <Export/>
        <Import/>
    </section>
    )
  
}
export default Setting