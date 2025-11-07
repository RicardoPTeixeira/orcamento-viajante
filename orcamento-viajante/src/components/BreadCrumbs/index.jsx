import { useSearchParams } from 'react-router-dom';

import './breadcrumbs.css'

function BreadCrumbs(infos) {
    const [searchParams, setSearchParams] = useSearchParams();
    const idTravel = searchParams.get('idTravel')

    if(infos.isMenu) {
        return (
            <section className='section breadcrumbs'>
                <a href="/">Home</a>
                <span>&gt;</span>
                <p>{idTravel}</p>
            </section>
        )
    } else {
        return (
            <section className='section breadcrumbs'>
                <a href="/">Home</a>
                <span>&gt;</span>
                <a href={'/menu?idTravel='+idTravel}>{idTravel}</a>
                <span>&gt;</span>
                <p>{infos.pagAtual}</p>
            </section>
        )
    }
    

}

export default BreadCrumbs
