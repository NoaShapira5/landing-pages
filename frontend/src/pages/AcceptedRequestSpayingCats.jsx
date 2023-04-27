import { useParams } from "react-router-dom"
import mainLogo from '../logos/mainLogo.png'

function AcceptedRequestSpayingCats() {
    const {sequenceID} = useParams()
  return (
    <> 
      <section className="heading">
        <img src={mainLogo} alt='איגוד ערים גוש דן' className='main-logo' />
      </section>
      
            <p>תודה שפנית לשירותים הוטרינרים גוש דן</p>
            <br/>
            <p>מספר פנייתך {sequenceID}</p>
            <p>בקשתך ללכידת חתולים  לצורך עיקור הועברה לבדיקה ותיאום מועד לכידה.</p>
            <br/>
            <p>,השירותים הוטרינרים לשירותך</p>
            <p> גם בצ'ט חי  עם נציג בווטסאפ:  052-538-8631 ◄</p>
        
    </>
  )
}

export default AcceptedRequestSpayingCats
