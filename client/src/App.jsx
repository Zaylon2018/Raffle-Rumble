import React, {useEffect, useState} from 'react'

const apiBase = "/api"

function Nav({cartCount}){
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-2xl font-bold text-red-600">Raffle Rumble</div>
          <nav className="hidden md:flex space-x-4 text-sm text-gray-600">
            <a href="#/" className="nav-link">Home</a>
            <a href="#/draw" className="nav-link">Live Draw</a>
            <a href="#/about" className="nav-link">About</a>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <button id="loginBtn" className="text-sm">Login</button>
          <a href="#/cart" className="bg-red-600 text-white px-3 py-2 rounded">Basket ({cartCount})</a>
        </div>
      </div>
    </header>
  )
}

function Home({onView}){
  const [comps,setComps]=useState([])
  useEffect(()=>{ fetch(apiBase+'/competitions').then(r=>r.json()).then(setComps).catch(()=>setComps([])) },[])
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-6">
        {comps.map(c=> (
          <div key={c.id} className="bg-white rounded shadow p-4">
            <img src={c.images?.[0]||'/assets/placeholder1.jpg'} className="w-full h-40 object-cover rounded" alt="" />
            <h3 className="mt-3 text-lg font-semibold">{c.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{c.cash_alternative || ''}</p>
            <div className="mt-3 flex items-center justify-between">
              <div className="text-sm text-gray-700">{(c.tickets_sold||0).toLocaleString()} / {(c.tickets_total||0).toLocaleString()} tickets</div>
              <button onClick={()=>onView(c.id)} className="bg-red-600 text-white px-3 py-2 rounded text-sm">View</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function CompDetail({id, onAdd}){
  const [comp,setComp]=useState(null)
  useEffect(()=>{ fetch(apiBase+'/competitions/'+id).then(r=>r.json()).then(setComp).catch(()=>setComp(null)) },[id])
  if(!comp) return <div className="container mx-auto px-4 py-8">Loading...</div>
  const pct = Math.round((comp.tickets_sold||0) / (comp.tickets_total||1) * 100)
  const [qty,setQty]=useState(1)
  return (
    <div className="container mx-auto px-4 py-8 grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-white rounded shadow p-4">
        <img src={comp.images?.[0]||'/assets/placeholder1.jpg'} className="w-full h-64 object-cover rounded" alt="" />
        <h2 className="text-2xl font-bold mt-4">{comp.title}</h2>
        <p className="text-gray-600 mt-2">{comp.description}</p>
      </div>
      <div className="bg-white rounded shadow p-4">
        <div className="text-sm text-gray-600">Price per ticket</div>
        <div className="text-3xl font-bold mt-1">£{(comp.price_per_ticket||0).toFixed(2)}</div>
        <div className="mt-4">
          <div className="text-sm">Choose tickets</div>
          <div className="mt-2 space-x-2">
            {[25,50,100,250].map(n=> <button key={n} onClick={()=>setQty(n)} className="px-3 py-2 border rounded">{n}</button>)}
          </div>
          <div className="mt-3 flex items-center space-x-2">
            <button onClick={()=>setQty(Math.max(1,qty-1))} className="px-2 py-1 border rounded">-</button>
            <input value={qty} onChange={e=>setQty(Math.max(1,parseInt(e.target.value||1)))} className="w-16 text-center border rounded px-2 py-1" />
            <button onClick={()=>setQty(qty+1)} className="px-2 py-1 border rounded">+</button>
          </div>
          <button onClick={()=>onAdd({id:comp.id,title:comp.title,price:comp.price_per_ticket,qty})} className="mt-4 w-full bg-red-600 text-white px-4 py-2 rounded">Add to basket</button>
        </div>
        <div className="mt-6">
          <div className="text-sm text-gray-600">Progress</div>
          <div className="w-full bg-gray-200 h-3 rounded mt-2"><div style={{width: pct+'%'}} className="bg-green-500 h-3 rounded"></div></div>
          <div className="text-sm text-gray-600 mt-2">{pct}% sold</div>
        </div>
      </div>
    </div>
  )
}

function Cart({items, onChange}){
  const total = items.reduce((s,i)=>s + (i.price||0)*i.qty,0)
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded shadow p-4">
        {items.length===0 ? <div>Your basket is empty.</div> : items.map((i,idx)=>(
          <div key={idx} className="flex items-center justify-between py-3 border-b">
            <div>
              <div className="font-semibold">{i.title}</div>
              <div className="text-sm text-gray-600">{i.qty} x £{(i.price||0).toFixed(2)}</div>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={()=>onChange(idx, Math.max(1, i.qty-1))} className="px-2 py-1 border rounded">-</button>
              <div>{i.qty}</div>
              <button onClick={()=>onChange(idx, i.qty+1)} className="px-2 py-1 border rounded">+</button>
              <button onClick={()=>onChange(idx,0)} className="text-sm text-red-600">Remove</button>
            </div>
          </div>
        ))}
        <div className="text-right mt-4 font-bold">Total: £{total.toFixed(2)}</div>
      </div>
    </div>
  )
}

function Draw(){
  const [comps,setComps]=useState([])
  const [result,setResult]=useState(null)
  useEffect(()=>{ fetch(apiBase+'/competitions').then(r=>r.json()).then(setComps).catch(()=>setComps([])) },[])
  const run = async (id)=>{
    const r = await fetch(apiBase+'/draw', {method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({competitionId:id})})
    const j = await r.json(); setResult(j)
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-bold">Live Draw Simulation</h2>
        <div className="mt-4">
          <select id="compSel" className="border rounded px-3 py-2">
            {comps.map(c=> <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
        <div className="mt-4">
          <button onClick={()=>{ const sel = document.getElementById('compSel'); run(sel.value); }} className="bg-red-600 text-white px-4 py-2 rounded">Run Draw</button>
        </div>
        {result && <div className="mt-4 p-4 bg-green-50 rounded">Winner ticket: <strong>{result.winner}</strong></div>}
      </div>
    </div>
  )
}

export default function App(){
  const [route, setRoute] = useState(window.location.hash || '#/')
  const [cart, setCart] = useState([])
  useEffect(()=>{ const onHash=()=>setRoute(window.location.hash || '#/'); window.addEventListener('hashchange', onHash); return ()=>window.removeEventListener('hashchange', onHash) },[])
  useEffect(()=>{ const saved = JSON.parse(localStorage.getItem('rr_cart')||'[]'); setCart(saved) },[])
  useEffect(()=> localStorage.setItem('rr_cart', JSON.stringify(cart)),[cart])

  const onAdd = (item)=> setCart(prev=>{ const ex = prev.find(p=>p.id===item.id); if(ex){ return prev.map(p=>p.id===item.id? {...p, qty: p.qty + item.qty}: p)} return [...prev, item] })
  const onChange = (idx, qty)=> setCart(prev=>{ const copy = [...prev]; if(qty<=0){ copy.splice(idx,1) } else { copy[idx].qty = qty } return copy })

  return (
    <div>
      <Nav cartCount={cart.reduce((s,i)=>s+i.qty,0)} />
      {route === '#/' && <Home onView={id=> window.location.hash = '#/comp/'+id} />}
      {route.startsWith('#/comp/') && <CompDetail id={route.split('/')[2]} onAdd={onAdd} />}
      {route === '#/cart' && <Cart items={cart} onChange={onChange} />}
      {route === '#/draw' && <Draw />}
      {route === '#/about' && <div className="container mx-auto px-4 py-8"><div className="bg-white rounded shadow p-6">About Raffle Rumble - Demo</div></div>}
    </div>
  )
}
