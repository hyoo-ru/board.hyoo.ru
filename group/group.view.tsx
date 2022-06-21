/** @jsx $mol_jsx */
namespace $.$$ {

	export class $hyoo_board_group extends $.$hyoo_board_group {
		
		_drag_local = false
		
		@ $mol_mem
		override head_content() {
			return [
				this.Title(),
				... this.links().length
					? []
					: [ this.Delete() ],
			]
		}
		
		@ $mol_mem
		override widgets() {
			return this.links().map( (_,i)=> this.Widget(i) )
		}
		
		override bookmark_uri( index: number ) {
			return this.links()[ index ].uri
		}
		
		@ $mol_mem_key
		override bookmark_text( index: number, next?: string ) {
			
			const links = this.links()
			let data = links[ index ]
			
			if( next === undefined ) return data.title || data.uri
			
			data = { ... data, title: next }
			
			this.links([
				... links.slice( 0, index ),
				data,
				... links.slice( index + 1 ),
			])
			
			return next
			
		}
		
		@ $mol_mem_key
		override bookmark_image( index: number ) {
			return this.bookmark_text( index ).match( /https?:\/\/\S+$/ )?.[0] ?? ''
		}
		
		@ $mol_mem_key
		override bookmark_title( index: number ) {
			return this.bookmark_text( index ).replace( /\s*https?:\/\/\S+$/g, '' )
		}
		
		@ $mol_mem_key
		override bookmark_content( index: number ) {
			return [
				this.Bookmark_title( index ),
				... this.bookmark_image( index )
					? [ this.Bookmark_image( index ) ]
					: []
			]
		}
		
		override bookmark_html( index: number ) {
			return (<a href={ this.bookmark_uri( index ) }>{ this.bookmark_text( index ) }</a>).outerHTML
		}
		
		override link_receive( index: number, next: $hyoo_board_link[] ) {
			const links0 = this.links()
			const pre = links0.slice( 0, index ).filter( l => !next.find( n => l.uri === n.uri ) )
			const post = links0.slice( index ).filter( l => !next.find( n => l.uri === n.uri ) )
			const links = [ ... pre, ... next, ... post ]
			
			if( links.length !== links0.length + next.length ) {
				this._drag_local = true
				setTimeout( ()=> this._drag_local = false )
			}
			
			this.links( links )
		}
		
		override widget_drag_end( index: number, event: DragEvent ) {
			if( this._drag_local ) return
			if( event.dataTransfer?.dropEffect !== 'move' ) return
			const links = this.links().slice()
			links.splice( index, 1 )
			this.links( links )
		}
		
		override hover( event : PointerEvent ) {
			this.edit( event.altKey )
		}
		
		override bookmark_edit_submit( index: number ) {
			this.edit( false )
			this.Bookmark_link( index ).focused( true )
		}
		
		go() {
			this.$.$mol_dom_context.parent.close()
		}
		
	}
}
