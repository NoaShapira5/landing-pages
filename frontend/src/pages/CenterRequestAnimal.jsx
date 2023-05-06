import { useState, useRef, useEffect } from "react"
import useFetch from "../hooks/useFetch"
import mainLogo from '../logos/mainLogo.png'
import ReactSwitch from "react-switch"
import axios from "axios"
import ReCAPTCHA from "react-google-recaptcha";
import Spinner from "../components/Spinner"
import {toast} from 'react-toastify'
import Select from "react-select"

const theme = theme => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary: "#00a3a3",
    primary25: "#e5f7f7",
    neutral20: "#00a3a3",
    neutral30: "#00a3a3"
  },
  borderRadius: 5,
  direction: 'ltr'
});

function CenterRequestAnimal() {

  const cities = useFetch('/getCities')
  const animalTypes = useFetch('/getAnimalTypes')
  const inquiryTypes = useFetch('/getInquiryTypes')

  const [streets, setStreets] = useState([])
  const [ownerDetails, setOwnerDetails] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  })
  const getCaptchaRef = useRef(null);
  const [inquiryReporters, setInquiryReporters] = useState(['מוקד בני ברק' ,'רמת גן- מוקד' ,'פקח','עיריית הרצליה'])
  const [valid, setValid] = useState(false)
  const [formInput, setFormInput] = useState({
    Date: new Date().toISOString(),
    InquiryDetails:'',
    InquiryTypeID: '',
    AnimalTypeID: '',
    IsContinuous:false,
    LocationCityID: '',
    LocationHouseNumber:'',
    LocationApartment:'',
    LocationStreet: '',
    LocationDescription:'',
    ReferenceDetails:'',
    IsReporterOnSite:false,
    InquiryReporter: '',
  })

  useEffect(() => {
    if(formInput.LocationCityID) {
      axios.post(`/getStreets`, {CityID: formInput.LocationCityID}).then((res) => {
      if(res.data.IsSuccess) {
        setStreets(res.data.Streets)
      } else {
        console.log('error in getting the streets')
      }
    })
    }
  }, [formInput.LocationCityID])


  const onSubmit = async (e) => {
    e.preventDefault()
    if(valid){
      if(!ownerDetails.firstName || !ownerDetails.lastName || !ownerDetails.phone || !formInput.InquiryDetails || !formInput.InquiryTypeID || !formInput.LocationCityID || !formInput.ReferenceDetails || !formInput.InquiryReporter) {
        toast.error('יש למלא את כל שדות החובה')
        return
      }
      const res = await axios.post('/saveInquiry', {formInput, ownerDetails})
        if(res.data.loading) {
          return <Spinner />
        }
        if(res.data.IsSuccess) {
          toast.success('הפניה נוצרה בהצלחה')
        } else {
          toast.error('שגיאה ביצירת הפניה')
        }
      
      }
      else{
        alert("please verify you are not a robot")
      }
  }

  const onChange = (e) => {
    setFormInput({
      ...formInput,
      [e.target.id]: e.target.value
  })
  }

  const onOwnerDetailsChange = (e) => {
    setOwnerDetails({
      ...ownerDetails,
      [e.target.id]: e.target.value
    })
  }

  const reCaptchaValue = async () => {
    const token = getCaptchaRef.current.getValue();
    await axios
    .post("/status", {
      response: token,
    })
    .then((res) => {
      setValid(res.data)
    })
    .catch((err) => {
      console.log(err);
    });
  };

  if(cities.loading || animalTypes.loading || inquiryTypes.loading) {
    return <Spinner />
  }

  return (
    <> 
      <section className="heading">
      <img src={mainLogo} alt='איגוד ערים גוש דן' className='main-logo' />
        <p>
           דף נחיתה למוקד לתיעוד פנייה לגבי בעל חיים
        </p>
      </section>
      <section>
        <form onSubmit={onSubmit} className='form'>
            <div className="form-group">
                
                <input type="datetime-local " className="form-control"
                id="Date" value={formInput.Date} onChange={onChange}
                placeholder='תאריך ושעה'
                dir="rtl"
                readOnly/>         

                <p style={{textAlign: 'right'}}>פרטי הפונה</p>

                <input type="text" className="form-control" 
                id='firstName' onChange={onOwnerDetailsChange}
                placeholder='שם פרטי*' value={ownerDetails.firstName} 
                dir="rtl" />
            
                <input type="text" className="form-control" 
                id='lastName' onChange={onOwnerDetailsChange}
                placeholder='שם משפחה*' value={ownerDetails.lastName} 
                dir="rtl" />

                <input type="text" className="form-control" 
                id='phone' onChange={onOwnerDetailsChange}
                placeholder='טלפון*' value={ownerDetails.phone} 
                dir="rtl" />

                <input type="email" className="form-control" 
                id='email' onChange={onOwnerDetailsChange}
                placeholder='דוא"ל' value={ownerDetails.email} 
                dir="rtl" />

                <p style={{textAlign: 'right'}}>פרטי הפנייה</p>

                <input type="text" className="form-control" 
                id='InquiryDetails' value={formInput.InquiryDetails} onChange={onChange}
                placeholder='פרטי הפנייה*' 
                dir="rtl" />

               <div className="select-container" style={{textAlign: 'right', fontSize: '13px', marginBottom: '10px'}}>
                  <Select
                  options={inquiryTypes && inquiryTypes.data.InquiryTypes.map(type => ({label: type.Name, value: type.ID}))}
                  placeholder="-- בחר את נושא הפנייה --"
                  value={formInput.InquiryTypeID}
                  onChange={(data) => setFormInput({...formInput, InquiryTypeID: data.value})}
                  theme={theme}
                  isRtl
                  />
                </div>

                <div className="select-container" style={{textAlign: 'right', fontSize: '13px', marginBottom: '10px'}}>
                  <Select
                  options={animalTypes.data && animalTypes.data.Types.map(item => ({label: item.Name, value: item.ID}))}
                  placeholder="-- בחר סוג בעל חיים --"
                  value={formInput.AnimalTypeID}
                  onChange={(data) => setFormInput({...formInput, AnimalTypeID: data})}
                  theme={theme}
                  isRtl
                  />
                </div>


                <div dir="rtl" className="toggle" style={{display: 'flex', gap: '30px'}}>
                  <p dir="rtl">האם האירוע חד פעמי או חוזר על עצמו?</p>
                  <label htmlFor="material-switch">
                    <ReactSwitch
                      checked={formInput.IsContinuous}
                      onChange={ (val) => setFormInput({...formInput, IsContinuous: val})}
                      onColor="#86d3ff"
                      onHandleColor="#2693e6"
                      handleDiameter={30}
                      uncheckedIcon={false}
                      checkedIcon={false}
                      boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                      activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                      height={20}
                      width={48}
                      className="react-switch"
                      id="material-switch"
                    />
                    {formInput.IsContinuous ? (<span>חוזר על עצמו</span>) : (<span>חד פעמי</span>)}
                  </label>
                </div>

                <p style={{textAlign: 'right'}}>מקום הפנייה</p>

                <div className="select-container" style={{textAlign: 'right', fontSize: '13px', marginBottom: '10px'}}>
                  <Select
                  options={cities.data && cities.data.Cities.map(item => ({label: item.Name, value: item.ID}))}
                  placeholder="-- בחר יישוב* --"
                  value={formInput.CityID}
                  onChange={(data) => setFormInput({...formInput, LocationCityID: data.value})}
                  theme={theme}
                  isRtl
                 
                  />
                </div>


                <div className="select-container" style={{textAlign: 'right', fontSize: '13px', marginBottom: '10px'}}>
                  <Select
                  options={ streets && streets.map(item => ({label: item.Name, value: item.ID}))}
                  placeholder="-- בחר רחוב --"
                  onChange={(data) => setFormInput({...formInput, LocationStreetID: data.value})}
                  theme={theme}
                  isRtl
                  />
                </div>

                <input type="number" className="form-control" 
                id='LocationHouseNumber' value={formInput.LocationHouseNumber} onChange={onChange}
                placeholder='מספר בית' 
                dir="rtl"/>

                <input type="number" className="form-control" 
                id='LocationApartment' value={formInput.LocationApartment} onChange={onChange}
                placeholder='מספר דירה' 
                dir="rtl"/>

                <input type="text" className="form-control" 
                id='LocationDescription' value={formInput.LocationDescription} onChange={onChange}
                placeholder='תיאור מקום האירוע'
                dir="rtl" />

                <div dir="rtl" className="toggle" style={{display: 'flex', gap: '30px'}}>
                  <p dir="rtl">האם הפונה נמצא במקום האירוע?</p>
                  <label htmlFor="material-switch">
                    <ReactSwitch
                      checked={formInput.IsReporterOnSite}
                      onChange={ (val) => setFormInput({...formInput, IsReporterOnSite: val})}
                      onColor="#86d3ff"
                      onHandleColor="#2693e6"
                      handleDiameter={30}
                      uncheckedIcon={false}
                      checkedIcon={false}
                      boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                      activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                      height={20}
                      width={48}
                      className="react-switch"
                      id="material-switch"
                    />
                    {formInput.IsReporterOnSite ? (<span>כן</span>) : (<span>לא</span>)}
                  </label>
                </div>

                <p style={{textAlign: 'right'}}>פרטי מוקד</p>

                <div className="select-container" style={{textAlign: 'right', fontSize: '13px', marginBottom: '10px'}}>
                  <Select
                  options={ inquiryReporters && inquiryReporters.map(reporter => ({label: reporter, value: reporter}))}
                  placeholder="גורם מדווח"
                  value={formInput.InquiryReporter}
                  onChange={(data) => setFormInput({...formInput, InquiryReporter: data})}
                  theme={theme}
                  isRtl
                  />
                </div>

                <input type="text" className="form-control" 
                id='ReferenceDetails' value={formInput.ReferenceDetails} onChange={onChange}
                placeholder='אסמכתא (מספר פנייה במוקד)*'
                dir="rtl" />

                <div className="recaptcha">
                  <ReCAPTCHA 
                  sitekey={process.env.REACT_APP_SITE_KEY}
                  ref={getCaptchaRef}
                  onChange={() => {
                    reCaptchaValue();
                  }}
                  />
                </div>

                
                <button className="btn btn-block">צור פנייה</button>
            </div>

        </form>
      </section>
    </>
  )
}

export default CenterRequestAnimal

